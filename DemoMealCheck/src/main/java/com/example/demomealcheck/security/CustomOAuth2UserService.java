package com.example.demomealcheck.security;

import com.example.demomealcheck.domain.enums.AuthProvider;
import com.example.demomealcheck.domain.entity.Role;
import com.example.demomealcheck.domain.entity.User;
import com.example.demomealcheck.repository.RoleRepository;
import com.example.demomealcheck.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        return processOAuth2User(registrationId, oAuth2User);
    }

    private OAuth2User processOAuth2User(String registrationId, OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");
        String providerId = String.valueOf(attributes.get("sub"));

        if (!StringUtils.hasText(email)) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        AuthProvider provider = AuthProvider.valueOf(registrationId.toUpperCase());
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            user.setFullName(StringUtils.hasText(name) ? name : user.getFullName());
            if (StringUtils.hasText(picture)) {
                user.setAvatarUrl(picture);
            }
            user = userRepository.save(user);
        } else {
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_USER").build()));

            user = User.builder()
                    .email(email)
                    .fullName(StringUtils.hasText(name) ? name : "User")
                    .avatarUrl(picture)
                    .provider(provider)
                    .providerId(providerId)
                    .enabled(true)
                    .roles(Collections.singleton(userRole))
                    .build();
            user = userRepository.save(user);
        }

        return UserPrincipal.create(user, attributes);
    }
}
